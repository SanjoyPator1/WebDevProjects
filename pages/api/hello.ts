// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from '@/lib/db'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const resp = await db({
    text: 'SELECT 1;',
    params: []
  })
  res.status(200).json({ name: 'John Doe', resp })
}
