export const defaultThumbnailPath = "./img/RockNRollGuitarist.png";
export const defaultCardPath = defaultThumbnailPath;

export const MOBILEWIDTHCUTOFF = 736; // 414
export const HEADERFOOTERSIZE = 170; // Size of header + footer heights combined

export const getScrollHeightPercent = () => {
  const browserHeight = window.innerHeight;
  const percentScrollPercent =
    ((browserHeight - HEADERFOOTERSIZE) / browserHeight) * 100;
  // console.log(
  //   "browserHeight: " +
  //     browserHeight +
  //     ", percentScrollPercent: " +
  //     percentScrollPercent
  // );
  return percentScrollPercent;
};
