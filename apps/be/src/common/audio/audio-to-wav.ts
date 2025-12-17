import { exec } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function audioToWav(
  audioBuffer: Buffer,
  inputExt: string, // webm, ogg, mp4, m4a 등
): Promise<Buffer> {
  const id = randomUUID();
  const inputPath = join(tmpdir(), `${id}.${inputExt}`);
  const outputPath = join(tmpdir(), `${id}.wav`);

  try {
    await writeFile(inputPath, audioBuffer);

    await new Promise<void>((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${inputPath}" -vn -ac 1 -ar 16000 -f wav "${outputPath}"`,
        (err, stdout, stderr) => {
          if (err) {
            console.error('ffmpeg error:', stderr);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });

    return await readFile(outputPath);
  } finally {
    await Promise.allSettled([
      unlink(inputPath),
      unlink(outputPath),
    ]);
  }
}