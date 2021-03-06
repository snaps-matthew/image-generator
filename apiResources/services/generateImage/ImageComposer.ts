import { Canvas, createCanvas, Image } from 'canvas';
import { newCanvas } from 'apiResources/utils/newCanvas';
import CommonCode from 'apiResources/constants/CommonCode';
import { sceneTypeCode } from 'apiResources/constants/sceneType';

class ImageComposer {
  protected categoryName: string;
  protected productCode: string;
  protected optionInfo: any;
  protected layerOrder: string[];
  protected wrinkleMag: number;
  protected artworkWidth: any;
  protected artworkHeight: any;
  protected artProductIndex: string;
  protected target: string;
  protected productSize: string;
  protected thumbnailImage: any;
  protected directionCode: string;
  protected canvas: Canvas;
  protected tempCanvas: Canvas;
  protected sizeCode: string;
  protected paperCode: string;
  protected backCode: string;
  protected ext: string;
  protected printPosition: string;
  protected productColor: string;
  protected productEditInfo: any;
  public contentType: string;

  constructor() {
    this.target = '';
    this.productCode = '';
    this.sizeCode = ''
    this.layerOrder = [];
    this.wrinkleMag = -20;
    this.categoryName = '';
    this.directionCode = '';
    this.artProductIndex = '';
    this.canvas = createCanvas(1000,1000);
    this.tempCanvas = createCanvas(1000, 1000);
    this.productSize = '';
    this.productColor = '';
    this.paperCode = '';
    this.backCode = '';
    this.ext = '';
    this.contentType = '';
    this.thumbnailImage = createCanvas(10,10);
    this.optionInfo = '';
    this.productEditInfo = '';
    this.printPosition = '';
  }

  async init(data:{
    thumbnailImage:any, target:string, productEditInfo:any, optionInfo:any, scene:any, artProductIndex:string
  }) {

    // 이미지 매직에 사용될 인자들
    // (1) 아트워크 소스 이미지 좌표 [배열] => width/height 값 이용해서 만든다
    // (2) 아트워크 들어갈 좌표 [배열] => coordinateData[productCode][option] 파일에 있다
    // (3) 상품 컬러코드 "문자" => "#ffffff"
    // (4) 상품 리소스 경로 => AWS S3 경로

    const ext = data.optionInfo.ext;
    this.productCode = data.productEditInfo.productCode;
    this.categoryName = data.productEditInfo.groupDelimiterName;
    this.directionCode = data.productEditInfo.directionCode || '';
    this.thumbnailImage = data.thumbnailImage;
    this.productEditInfo = data.productEditInfo;
    this.artProductIndex = data.artProductIndex;
    this.optionInfo = data.optionInfo;
    this.target = data.target;
    this.productSize = data.optionInfo.sizeCode;
    this.productColor = data.optionInfo.colorCode;
    this.contentType = ext === 'jpg'? 'image/jpeg' : 'image/png';
    this.printPosition = sceneTypeCode[data.scene.type];
    this.ext = ext;

    this.artworkWidth = (!data.optionInfo.printPositionCode || data.optionInfo.printPositionCode === CommonCode.PRINT_POSITION_FRONT) ? data.productEditInfo.edit[0].width * 2 : data.productEditInfo.edit[1].width * 2;
    this.artworkHeight = (!data.optionInfo.printPositionCode || data.optionInfo.printPositionCode === CommonCode.PRINT_POSITION_FRONT) ? data.productEditInfo.edit[0].height * 2 : data.productEditInfo.edit[1].height * 2;


    // 주름 넣는 강도??
    this.wrinkleMag = -20;

    // 필요 없을 수도 있다 => Apparel 들어가서 나눌까
    this.layerOrder = [];
  }

  drawObject(source: Image | Canvas, target: Canvas, x: number, y: number, width: number, height: number, angle: number = 0, skew: number=0) {
    const ctx = target.getContext('2d');
    let halfWidth = 0, halfHeight = 0, realX = x, realY = y;

    ctx.save();
    if (angle !== 0) {
      halfWidth = width / 2;
      halfHeight = height / 2;
      ctx.translate(x + halfWidth, y + halfHeight);
      ctx.rotate(angle * Math.PI / 180);
      realX = 0;
      realY = 0;
    }
    if (skew) {
      ctx.transform(1, skew, 0, 1, 0, 0);
    }
    ctx.drawImage(source, realX - halfWidth, realY - halfHeight, width, height);
    ctx.restore();
  }

  stream(){
    if(this.ext === 'png'){
      return this.canvas.createPNGStream();

    } else {
      const width = this.canvas.width;
      const height = this.canvas.height;
      const tmp = newCanvas(width, height);
      tmp.ctx.fillStyle = '#ffffff';
      tmp.ctx.fillRect(0,0, width, height);
      tmp.ctx.drawImage(this.canvas, 0, 0);

      return tmp.canvas.createJPEGStream({
        quality: 1,
        progressive: true,
        chromaSubsampling: false,
      });
    }
  }

}

export default ImageComposer
