import Config from "apiResources/constants/Config";
import {loadImage} from "apiResources/utils/loadImage";
import { SceneType } from 'apiResources/constants/sceneType';
import { imageFull } from 'apiResources/utils/imageAlign';
import { newCanvas } from 'apiResources/utils/newCanvas';
import TargetType from 'apiResources/constants/TargetType';
import { getArtworkImage, getCreateImageInitInfo, getScale } from 'apiResources/utils/getSelectedScene';
import { getOffsetWrapper } from 'apiResources/utils/getOffsetWrapper';

export const createImageOfTopView = async (props:{templateImage: any, productEditInfo:any, optionInfo:any, canvas: any, target:any}) => {

  const {templateImage, productEditInfo, optionInfo, canvas, target} = props;
  const productCode:string = productEditInfo.productCode;
  const directionCode = productEditInfo.directionCode

  const domain = `${Config.RESOURCE_CDN_URL}/${productCode}`;
  const skinPath = `${domain}/${SceneType.page}/${directionCode}/`;
  const skinPathTop = skinPath+'top.png';
  const {ctx, outBox} = getCreateImageInitInfo(target, canvas)

  if (target !== TargetType.STORE_DETAIL_4) {
    //target 1, 2, 3의 경우
    const skinImage_top = await loadImage(skinPathTop);

    const {wrapper, offset}  = getOffsetWrapper(productCode, SceneType.page, directionCode, "Y")
    const groupDelimiterName = productEditInfo.groupDelimiterName
    const scale = getScale(groupDelimiterName)
    const wrapperWidth = wrapper.width * scale
    const wrapperHeight = wrapper.height * scale
    const offsetLeft = offset.left * scale
    const offsetTop = offset.top * scale

    const temp = newCanvas(wrapperWidth, wrapperHeight);

    temp.ctx.drawImage(templateImage, offsetLeft, offsetTop);
    temp.ctx.drawImage(skinImage_top, 0, 0,wrapperWidth, wrapperHeight);

    const size = imageFull(wrapperWidth, wrapperHeight, outBox.width, outBox.height, 0);
    ctx.drawImage(temp.canvas, size.x, size.y, size.width, size.height);

  }else{
    //target 4의 경우
    const {artworkImage, artworkImageWidth, artworkImageHeight}  = await getArtworkImage(productEditInfo, optionInfo)
    const size = imageFull(artworkImageWidth, artworkImageHeight, outBox.width, outBox.height, 0);
    ctx.drawImage(artworkImage, size.x, size.y, size.width, size.height);
  }
}
