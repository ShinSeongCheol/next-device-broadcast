import {getAudioDetailList} from "@/src/service/audio";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Play} from "lucide-react";

export default async function Home() {

  const audioDetails = await getAudioDetailList();

  return (
      <div className={'flex items-center justify-center py-4'}>
          <div className={'flex flex-col gap-4'}>
              <div className={'flex items-center justify-between'}>
                  <h1 className={'text-4xl font-bold'}>다시 듣기</h1>
                  <Button variant={'outline'}>더보기</Button>
              </div>

              <div className={'max-w-7xl overflow-x-auto whitespace-nowrap'}>
                  <div className={'inline-flex gap-4'}>
                        {audioDetails.map((audioDetail) => {
                          return (
                              <div key={audioDetail.id} className={'flex flex-col gap-2 w-full max-w-48 min-w-0'}>
                                  <AspectRatio ratio={1} className="relative w-full rounded-lg bg-neutral-800 group flex items-center justify-center">
                                      <Image src={`/api/images?audioId=${audioDetail.id}`} alt={audioDetail.audioCommon?.title ?? ""} fill sizes={'100%'} loading={'eager'} className="rounded-lg object-cover group-hover:cursor-pointer group-hover:opacity-80" />
                                      <Play fill={'white'} className={'absolute stroke-none opacity-0 group-hover:opacity-100 group-hover:cursor-pointer'}/>
                                  </AspectRatio>

                                  <div className={'w-full min-w-0 overflow-hidden'}>
                                      <p className={'font-semibold line-clamp-2 overflow-hidden break-all'}>
                                          {audioDetail.audioCommon?.title || ''}
                                      </p>
                                      <p className={'text-sm text-neutral-600 truncate'}>
                                          {audioDetail.audioCommon?.artist || ''}
                                      </p>
                                  </div>
                              </div>
                          )
                        })}
                  </div>
              </div>
          </div>
      </div>
  );
}
