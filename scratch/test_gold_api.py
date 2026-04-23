import httpx
import asyncio

async def test_gold_api():
    api_key = "goldapi-d25702fc51e71f14d2247d0786e4ac24-io"
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.goldapi.io/api/XAU/INR",
            headers={"x-access-token": api_key}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"24K Gram Price: {data.get('price_gram_24k')}")
            print(f"Percentage Change: {data.get('chp')}%")
        else:
            print(f"Error: {response.text}")

if __name__ == "__main__":
    asyncio.run(test_gold_api())
