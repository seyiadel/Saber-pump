import { NextApiRequest, NextApiResponse } from 'next';
import PinataSDK from '@pinata/sdk';

const pinata = new PinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === 'POST') {
            let result;

            if (req.headers['content-type']?.startsWith('multipart/form-data')) {
                // File upload
                const file = req.body;
                result = await pinata.pinFileToIPFS(file);
            } else {
                // JSON upload
                const json = JSON.parse(req.body);
                result = await pinata.pinJSONToIPFS(json);
            }

            return res.status(200).json({
                ipfsHash: result.IpfsHash
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('IPFS upload error:', error);
        return res.status(500).json({ error: 'Upload failed' });
    }
}