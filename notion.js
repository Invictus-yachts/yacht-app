exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-notion-token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { path, method, body } = JSON.parse(event.body);
    const token = event.headers['x-notion-token'];

    if (!token) return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };

    const fetch = require('node-fetch');
    const response = await fetch('https://api.notion.com' + path, {
      method: method || 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': '2022-06-01',
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
