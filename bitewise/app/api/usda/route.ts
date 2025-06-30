import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  const apiKey = process.env.USDA_API_KEY;
  
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query ?? '')}&api_key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return NextResponse.json(data);
}