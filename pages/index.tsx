import type { NextPage } from 'next';
import Config from 'apiResources/constants/Config';
const Home: NextPage = () => {
  return (
    <div>
      <img src={`${Config.ERROR_IMAGE_URL}`}/>
      <p>codePipeline 테스트 중입니다.</p>
    </div>
  );
};

export default Home;
