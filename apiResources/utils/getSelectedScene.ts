import CommonCode from 'apiResources/constants/CommonCode';
import { TYPE } from 'apiResources/constants/type';
import Config from 'apiResources/constants/Config';
import { loadImage } from 'apiResources/utils/loadImage';
import productInfo from 'apiResources/constants/productInfo';
import TargetType from 'apiResources/constants/TargetType';

export const getSelectedScene = (productEditInfo:any, optionInfo?:any) => {
  const groupName = productEditInfo.groupDelimiterName;
  let tempScene
  if(productEditInfo.edit.length>1){
    if(groupName === "apparel"){
      let printPosition:string;
      const printPositionCode = optionInfo.printPositionCode
      if(printPositionCode===CommonCode.PRINT_POSITION_FRONT){
        printPosition = 'front'
      }else if(printPositionCode===CommonCode.PRINT_POSITION_BACK){
        printPosition = 'back'
      }
      tempScene = productEditInfo.edit.find((obj:any) => {
        return  obj.type === printPosition
      })
    }else if(groupName === "canvasFrame" || groupName === "sticker"){
      let sizeCode = optionInfo.sizeCode
      tempScene = productEditInfo.edit.find((obj:any) => {
        return  obj.sizeCode === sizeCode
      })
    }

  }else{
    tempScene = productEditInfo.edit[0]
  }
  return tempScene
}

export const getScale = (groupDelimiterName: string) => {
  let scale:number = 1
  switch (groupDelimiterName) {
    case 'apparel':
    case 'smartTok':
    case 'tinCase':
    case 'frame': // free size
    case 'canvasFrame': // free size
    case 'woodFrame': // free size
    case 'sticker': // free size
    case 'acrylicStand': // free size
    case 'acrylicKeyring': // free size
    case 'hardPhoneCase':
    case 'clearPhoneCase':
    case 'airpods':
    case 'airpodsPro':
    case 'buzCase':
    case 'button':
    case 'note':
    case 'card':
      scale = 2
      break;
    default:
      break;
  }
  return scale
};


export const getCreateImageInitInfo = (target:string, canvas:any) =>{
  let outBox:any = {};

  if (target === TargetType.STORE_LIST_1) {
    outBox = {width: 600, height: 600};
  } else {
    outBox = {width: 1000, height: 1000};
  }

  canvas.width = outBox.width;
  canvas.height = outBox.height;
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f1f1f1';
  ctx.fillRect(0, 0, outBox.width, outBox.height);
  const imageCanvasInfo:any = {ctx, outBox}

  return imageCanvasInfo
}

export const  getArtworkImage = async (productEditInfo:any, optionInfo?:string ) => {
  let scene:any = getSelectedScene(productEditInfo, optionInfo);
  let imageObject:any = scene.object.filter((obj:any) => {
    const type = obj.type
    return type === TYPE.OBJECT_IMAGE
  })

  const artworkImagePath = Config.DOMAIN_RESOURCE+"/"+imageObject[0].original.middleImagePath
  const artworkImage:any  = await loadImage(artworkImagePath);
  const artworkImageWidth = imageObject[0].original.width
  const artworkImageHeight = imageObject[0].original.height
  return {artworkImage, artworkImageWidth, artworkImageHeight}
}

export const getPreviewMargin = (productCode: string) => {
  return productInfo[productCode] &&
    (productInfo[productCode].margin || 5);
};
