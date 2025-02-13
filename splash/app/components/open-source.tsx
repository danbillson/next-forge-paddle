import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import { octokit } from '../lib/octokit';

export const OpenSource = async () => {
  const { data } = await octokit.repos.get({
    owner: 'danbillson',
    repo: 'next-forge-paddle',
  });
  const { data: contributors } = await octokit.repos.listContributors({
    owner: 'danbillson',
    repo: 'next-forge-paddle',
    anon: 'true',
    per_page: 100,
  });

  return (
    <div className="flex h-full flex-col items-start justify-between gap-4 p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-neutral-500">
          <StarIcon size={14} />
          <small>Open source</small>
        </div>
      </div>
      <a
        href="https://github.com/danbillson/next-forge-paddle"
        className="inline-flex rounded-md border bg-white px-4 py-2 font-medium text-sm shadow-sm"
      >
        Browse the source code
      </a>
    </div>
  );
};
