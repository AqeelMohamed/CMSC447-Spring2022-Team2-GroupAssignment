# Python script for initializing databases and populating with data from the csv.
# WARNING - Running this will overwrite the existing database.

import csv
import sqlite3
import os

def getFilePath(rel_filepath):
    '''
    Returns an absolute path to the given file, assuming the given filepath is relative to this file.
    '''
    base_path = os.path.dirname(__file__)
    return os.path.join(base_path, rel_filepath)

def removeExtraChars(oldString):
    '''
    Returns a lowercase copy of the string where non-alphabetic characters are replaced with '_'.
    '''
    return "".join([char.lower() if char.isalpha() else '_' for char in oldString])

def loadFile(path):
    '''
    Loads the crime data csv file from the given path.
    Parses through the data, formatting it into a dictionary whose keys are the file's
    headers and data are columns. Returns this resulting dictionary.
    '''
    if not os.path.exists(path):
        return None

    # Open the csv file
    with open(path, 'r') as f:
        # Read in the data and seperate the header
        fileInfo = csv.reader(f)
        columnInfo = next(fileInfo)

        infoDict = {}
        # Go through the array and format column headers
        for i in range(len(columnInfo)):
            columnInfo[i] = removeExtraChars(columnInfo[i])
            if columnInfo[i] == "report_dat":
                columnInfo[i] = "report_date"
            if columnInfo[i] == "yblock":
                columnInfo[i] = "y_block"
            if columnInfo[i] == "xblock":
                columnInfo[i] = "x_block"
            infoDict[columnInfo[i]] = []

        # Parse through the rest of the file and add info to the map accordingly
        for row in fileInfo:
            for column, cell in zip(columnInfo, row):
                infoDict[column].append(cell)

        # Return the parsed infomation in the format of a dict       
        return infoDict

def tryConvert(entry, func = int, default = -1):
    '''
    Helper method mainly to convert text values into numbers. No error cases, so validity of
    arguments must be determined elsewhere.
    '''
    return func(entry) if entry != '' else default

def checkDupeLocation(db, locationData):
    '''
    Checks whether the database has an identical entry to locationData (in everything but ID),
    returning the ID of the existing entry if found. If no entry is found, returns None.
    '''

    cur = db.execute('''SELECT location_id FROM CrimeLocation WHERE
                        neighborhood_cluster = ?
                        AND census_tract = ?
                        AND longitude = ?
                        AND latitude = ?
                        AND location = ?
                        AND block = ?
                        AND block_group = ?
                        AND x_block = ?
                        AND y_block = ?
                        AND district = ?
                        AND ward = ?
                        AND sector = ?
                        AND bid = ?
                        AND voting_precinct = ?
                        AND anc = ?
                      ''', locationData[1:]
                    )
    rv = cur.fetchone()
    cur.close()
    if rv is None:
        return None
    return rv[0]

def initDB(infoDict):
    '''
    Populates the database tables with the passed dictionary.
    Does not clear/check existing tables - make sure the database does not exist/is clear before use!
    Data labels used are hard coded, so introducing new variables will require manual adjustment.
    '''
    db = sqlite3.connect(getFilePath('../../cmsc447-team2-data.db'))
    init_db_sql = open(getFilePath('../sql_commands/init_db.sql'))
    db.executescript(init_db_sql.read())

    # Get length using the length of a column with no blank entries
    length = len(infoDict['neighborhood_cluster'])

    key = 0 # Acts as the ID counter for both crime data and location
    for row in range(length):

        locationData = (key,
            infoDict['neighborhood_cluster'][row],
            tryConvert(infoDict['census_tract'][row]),
            tryConvert(infoDict['longitude'][row], float, 0),
            tryConvert(infoDict['latitude'][row], float, 0),
            infoDict['location'][row],
            infoDict['block'][row],
            infoDict['block_group'][row],
            tryConvert(infoDict['x_block'][row], float),
            tryConvert(infoDict['y_block'][row], float),
            tryConvert(infoDict['district'][row]),
            tryConvert(infoDict['ward'][row]),
            infoDict['sector'][row],
            infoDict['bid'][row],
            infoDict['voting_precinct'][row],
            infoDict['anc'][row],
        )

        dupeLocation = checkDupeLocation(db, locationData)
        location_key = key
        if dupeLocation is None:
            key += 1
        else:
            location_key = dupeLocation

        crimeData = (key,
            location_key,
            infoDict['offense'][row],
            infoDict['offense_group'][row],
            infoDict['offense_text'][row],
            infoDict['offense_key'][row],
            infoDict['method'][row],
            tryConvert(infoDict['ucr_rank'][row]),
            tryConvert(infoDict['psa'][row]),
            tryConvert(infoDict['ccn'][row]),
            infoDict['octo_record_id'][row],
            infoDict['start_date'][row],
            infoDict['end_date'][row],
            infoDict['report_date'][row],
            tryConvert(infoDict['year'][row]),
            infoDict['shift'][row],
        )

        key += 1

        db.execute('INSERT INTO CrimeData (crime_id, location_id, offense, offense_group, offense_text, offense_key, method, ucr_rank, psa, ccn, octo_record_id, start_date, end_date, report_date, year, shift) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', crimeData)
        if dupeLocation is None:
            db.execute('INSERT INTO CrimeLocation (location_id, neighborhood_cluster, census_tract, longitude, latitude, location, block, block_group, x_block, y_block, district, ward, sector, bid, voting_precinct, anc) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', locationData)

    db.commit()
    db.close()

infoDict = loadFile(getFilePath('dc-crimes-search-results.csv'))
if infoDict is None:
    print( "Unable to open \"back-end/Parser/dc-crimes-search-results.csv\"")
else:
    initDB(infoDict)