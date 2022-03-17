
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function findCafe(search) {
    try {
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');
        await client.connect();
        const query = { 'Company Name': new RegExp(`\\b${search}\\b`, 'gi') };

        const cafe = await cafes.findOne(query);
        console.log(cafe);
        // const cafe = await cafes.find(query);

        // while (cafe.hasNext()) {
        //     console.log(cafe.next());
        // }

    } finally {
        await client.close();
    }
}

async function findAsync(arr, asyncCallback) {
    const promises = arr.map(asyncCallback);
    const results = await Promise.all(promises);
    const index = results.findIndex(result => result);
    return arr[index];
  }
  findAsync(arr, async (thing) => {
    const ret = await findThing();
    return false;
  })  
findCafe('Kapoors').catch(console.dir);
