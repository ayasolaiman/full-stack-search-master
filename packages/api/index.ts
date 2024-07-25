import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";

dotenv.config();

if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
  await import("./db/startAndSeedMemoryDB");
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hotels", async (req, res) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();
    const collection = db.collection("hotels");
    res.send(await collection.find().toArray());
  } finally {
    await mongoClient.close();
  }
});

app.post("/accomodations", async (req, res) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");

  const { query } = req?.body;
  console.log('Search Query:', query);
  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
    const db = mongoClient.db();

    // initialize data collections
    const hotelsCollection = db.collection("hotels");
    const countiresCollection = db.collection("countries");
    const citiesCollection = db.collection("cities");

    // do partial search by using regular expression
    const hotels = await hotelsCollection.find({
      $or: [
        { chain_name: new RegExp(query, "i") },
        { hotel_name: new RegExp(query, "i") },
        { country: new RegExp(query, "i") },
        { city: new RegExp(query, "i") },
      ],
    }).toArray();

    const countries = await countiresCollection.find({ country: new RegExp(query, "i") }).toArray();
    const cities = await citiesCollection.find({ name: new RegExp(query, "i") }).toArray();

    res.json({ hotels, countries, cities });

  } finally {
    await mongoClient.close();
  }
});

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
