import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

const server = new McpServer({
	name: 'Weather Server',
	version: '1.0.0',
});

/** Tool definition **/
server.tool(
	'get-weather', // Unique identifier
	'Tool to get the weather of a certain city.', // Helps AI understand what the tool does
	// Define parameters
	{
		city: z.string().describe('The city to get the weather for.'),
	},
	// Code that runs when the tool is called
	async ({ city }) => {
		try {
			// Get coordinates for the city using a geocoding API
			const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      );
			const geoData = await geoResponse.json();

			// Handle case where city is not found
			if (!geoData.results || geoData.results.length === 0) {
				return {
					content: [
						{
							type: 'text',
							text: `Sorry, I couldn't find a city named "${city}". Please check the spelling and try again.`
						},
					],
				}
			}

			// Get weather data using coordinates
			const { latitude, longitude } = geoData.results[0];
			const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&hourly=temperature_2m,precipitation&forecast_days=1`
      );
			const weatherData = await weatherResponse.json();

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(weatherData, null, 2)
					},
				],
			}
		} catch (error) {
			return {
				content: [
					{
						type: 'text',
						text: `Error fetching weather data: ${error.message}`
					},
				],
			}
		}
	},
);

/** Communication setup **/
// Uses terminal input/output for communication (perfect for local development)
const transport = new StdioServerTransport();
server.connect(transport);
