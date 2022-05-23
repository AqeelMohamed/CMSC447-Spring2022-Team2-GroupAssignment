-- SQLite
DROP TABLE IF EXISTS CrimeData;
DROP TABLE IF EXISTS CrimeLocation;

CREATE TABLE IF NOT EXISTS CrimeData (
    crime_id int primary key,
    location_id int NOT NULL,
    offense text,
    offense_group text,
    offense_text text,
    offense_key text, 
    method text,
    ucr_rank int,
    psa int, 
    ccn int,
    octo_record_id text,
    start_date text,
    end_date text,
    report_date text,
    year int,
    shift text,
    FOREIGN KEY(location_id) REFERENCES CrimeLocation (location_id)
);

CREATE TABLE IF NOT EXISTS CrimeLocation (
    location_id int primary_key,
    neighborhood_cluster text,
    census_tract int,
    longitude float,
    latitude float,
    location text,
    block text,
    block_group text,
    x_block float, 
    y_block float,
    district int,
    ward int,
    sector text,
    bid text,
    voting_precinct text,
    anc text
);