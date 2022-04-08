import express from "express"
import axios from "axios"
import cheerio from "cheerio"


const app = express()

const PORT = 5000

app.use(express.json())

const getPriceFeed = async () => {
    try {
        const url = "https://coinmarketcap.com/"

        const {data} = await axios({
            method: "GET",
            url
        })

        const $ = cheerio.load(data)

        const keys = [
            "rank",
            "name",
            "price",
            "24h",
            "7d",
            "marketCap",
            "volume",
            "circulatingSupply"
        ]

        const coinArray = []

        $(".h7vnx2-2 > tbody:nth-child(3) > tr").each((parentIndex, parentElem) => {
            let keyIndex = 0
            const coinObj = {}

            if (parentIndex <= 9) {
                $(parentElem).children().each((childIndex, childElem) => {
                    let tdValue = $(childElem).text()

                    if (keyIndex === 1 || keyIndex === 6) {
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if (tdValue) {
                        coinObj[keys[keyIndex]] = tdValue
                        keyIndex++
                    }
                })
                coinArray.push(coinObj)
            }
        })
        return coinArray
    } catch (error) {
        console.error(error)
    }
}
            

app.get("/crypto", async (req, res) => {
    try {
        const priceFeed = await getPriceFeed()
        return res.status(200).json({
            result: priceFeed
        })
    } catch (error) {
        res.status(500).json({error: error.toString()})
    }
})

app.listen(PORT, () => console.log(`Server is listening on the port: ${PORT}`)) 



