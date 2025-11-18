/**
 * Extracts the dominant color from an image URL
 * @param imageUrl URL of the image to analyze
 * @returns Promise resolving to the dominant color as a hex string
 */
export const extractDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          resolve("#666666");
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        const colorCounts: Record<string, number> = {};
        
        for (let i = 0; i < pixels.length; i += 16) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          if (a < 128) continue;
          
          if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;
          
          const rKey = Math.floor(r / 16) * 16;
          const gKey = Math.floor(g / 16) * 16;
          const bKey = Math.floor(b / 16) * 16;
          
          const key = `${rKey},${gKey},${bKey}`;
          
          if (!colorCounts[key]) {
            colorCounts[key] = 0;
          }
          
          colorCounts[key]++;
        }
        
        let dominantColor = "";
        let maxCount = 0;
        
        for (const key in colorCounts) {
          if (colorCounts[key] > maxCount) {
            maxCount = colorCounts[key];
            dominantColor = key;
          }
        }
        
        if (!dominantColor) {
          resolve("#666666");
          return;
        }
        
        const [r, g, b] = dominantColor.split(",").map(Number);
        const hexColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        
        resolve(hexColor);
      };
      
      img.onerror = () => {
        resolve("#666666");
      };
      
      img.src = imageUrl;
    } catch (error) {
      resolve("#666666");
    }
  });
};

/**
 * Creates a suitable text color (black or white) based on background color
 * @param backgroundColor The background color as a hex string
 * @returns Text color that will be readable on the background
 */
export const getTextColorForBackground = (backgroundColor: string): string => {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? "#000000" : "#ffffff";
}; 