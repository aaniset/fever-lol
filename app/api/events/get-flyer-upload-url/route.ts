import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 403 });
  }

  const reqBody = await req.json();

  if (!reqBody || !reqBody.params) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const { fileName, fileType } = reqBody.params;

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: `flyer/${fileName}`,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    const returnData = {
      signedRequest: signedUrl,
      url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/flyer/${fileName}`,
    };

    return new Response(JSON.stringify(returnData), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
