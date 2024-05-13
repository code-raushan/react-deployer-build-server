import {exec} from 'child_process'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY, PROJECT_ID, UPLOAD_BUCKET } from './config';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const client = new S3Client({
    region: AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

function init(){
    console.log('Started executing the script')
    const outputDir = path.join(__dirname, '..', 'output');
    
    const p = exec(`cd ${outputDir} && npm install && npm run build`);

    if (!p.stdout) throw new Error('Cannot spawn the process');

    p.stdout.on('data', (data: Buffer)=>{
        console.log('data', data.toString());
    });

    p.stdout.on('error', (data:Buffer)=>{{
        console.log('error', data.toString());
    }});

    p.on('close', async()=>{
        console.log('Build finished!');
        const distFolder = path.join(__dirname, '..', 'output', 'build');
        // exec('bash')

        const distFolderContent = fs.readdirSync(distFolder, {recursive: true});

        for(const file of distFolderContent){
            const filePath = path.join(distFolder, file.toString());
            if(fs.lstatSync(filePath).isDirectory()) continue

            console.log(`uploading ${file}`);

            console.log(`mimeType of file ${file} is ${mime.lookup(filePath)}`)

            const command = new PutObjectCommand({
                Bucket: UPLOAD_BUCKET,
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) as string
            });

            await client.send(command);
            console.log(`uploaded ${file}`);

        };
    });
};

init();

