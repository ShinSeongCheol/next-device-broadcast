import {getAudioDetailList} from "@/src/service/audio";
import {PreviewMusic} from "@/src/feature/audio";

export default async function Home() {

  const audioDetails = await getAudioDetailList();

  return (
      <div className={'flex items-center justify-center py-4'}>
          <PreviewMusic audioDetails={audioDetails}/>
      </div>
  );
}
