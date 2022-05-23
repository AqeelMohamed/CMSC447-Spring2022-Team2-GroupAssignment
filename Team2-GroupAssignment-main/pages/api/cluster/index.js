const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

export default async function handler(req, res) {
	const db = await sqlite.open({
		filename: './cmsc447-team2-data.db',
		driver: sqlite3.Database,
	})

	if (req.method === 'GET') {
		const data = await db.all(
			'SELECT CrimeData.location_id, offense, offense_group, method, start_date FROM CrimeLocation JOIN CrimeData ON CrimeData.location_id = CrimeLocation.location_id'
		)

		// const arr = {}
		// for (var i in data) {
		//   if (data[i].neighborhood_cluster != '') {
		//     if (data[i].neighborhood_cluster in arr) {
		//       arr[data[i].neighborhood_cluster]++
		//     } else {
		//       arr[data[i].neighborhood_cluster] = 1
		//     }
		//   } else {
		//     console.log('error')
		//   }
		// }
		// console.log(arr)

		res.status(200).json(data)
	}
}
