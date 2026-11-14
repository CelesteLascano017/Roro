/**
 * Canvas helpers used at load time to prepare the provided PNG files.
 *
 * The cropped character/object images have an opaque background baked in.
 * Instead of editing the original files, the background is removed in memory:
 * a flood fill starts at the image border and clears every connected pixel
 * whose colour matches one of the background colours. Interior pixels of the
 * same colour (for example dark outlines) are kept because they are not
 * connected to the border.
 */

function createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    return canvas;
}

export function imageToCanvas(image) {
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    return canvas;
}

/** Clears border-connected background pixels. Mutates the canvas. */
export function removeBackground(canvas, backgroundColors, tolerance = 3) {
    const { width, height } = canvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const visited = new Uint8Array(width * height);
    const stack = [];

    const isBackground = (index) => {
        const offset = index * 4;
        if (pixels[offset + 3] === 0) {
            return true;
        }
        return backgroundColors.some(([red, green, blue]) =>
            Math.abs(pixels[offset] - red) <= tolerance &&
            Math.abs(pixels[offset + 1] - green) <= tolerance &&
            Math.abs(pixels[offset + 2] - blue) <= tolerance);
    };

    for (let x = 0; x < width; x++) {
        stack.push(x, (height - 1) * width + x);
    }
    for (let y = 0; y < height; y++) {
        stack.push(y * width, y * width + width - 1);
    }

    while (stack.length > 0) {
        const index = stack.pop();
        if (visited[index]) {
            continue;
        }
        visited[index] = 1;
        if (!isBackground(index)) {
            continue;
        }

        pixels[index * 4 + 3] = 0;
        const x = index % width;
        const y = (index - x) / width;
        if (x > 0) stack.push(index - 1);
        if (x < width - 1) stack.push(index + 1);
        if (y > 0) stack.push(index - width);
        if (y < height - 1) stack.push(index + width);
    }

    context.putImageData(imageData, 0, 0);
    return canvas;
}

/** Returns the bounding box of non-transparent pixels, or null if empty. */
export function getContentBounds(canvas) {
    const { width, height } = canvas;
    const pixels = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height).data;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (pixels[(y * width + x) * 4 + 3] > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function trimCanvas(canvas) {
    const bounds = getContentBounds(canvas);
    if (!bounds) {
        return canvas;
    }
    const trimmed = createCanvas(bounds.width, bounds.height);
    trimmed.getContext('2d').drawImage(canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
    return trimmed;
}

/** Nearest-neighbour resize that keeps pixel art sharp. */
export function resizeNearest(canvas, scale) {
    if (scale === 1) {
        return canvas;
    }
    const targetWidth = Math.max(1, Math.round(canvas.width * scale));
    const targetHeight = Math.max(1, Math.round(canvas.height * scale));
    const source = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
    const resized = createCanvas(targetWidth, targetHeight);
    const context = resized.getContext('2d');
    const target = context.createImageData(targetWidth, targetHeight);

    for (let y = 0; y < targetHeight; y++) {
        const sourceY = Math.min(canvas.height - 1, Math.floor((y + 0.5) * canvas.height / targetHeight));
        for (let x = 0; x < targetWidth; x++) {
            const sourceX = Math.min(canvas.width - 1, Math.floor((x + 0.5) * canvas.width / targetWidth));
            const from = (sourceY * canvas.width + sourceX) * 4;
            const to = (y * targetWidth + x) * 4;
            target.data[to] = source.data[from];
            target.data[to + 1] = source.data[from + 1];
            target.data[to + 2] = source.data[from + 2];
            target.data[to + 3] = source.data[from + 3];
        }
    }

    context.putImageData(target, 0, 0);
    return resized;
}

/**
 * Pads a canvas to the given size, centred horizontally and aligned to the
 * bottom (the character's feet).
 */
export function padToSize(canvas, width, height) {
    if (canvas.width === width && canvas.height === height) {
        return canvas;
    }
    const padded = createCanvas(width, height);
    padded.getContext('2d').drawImage(canvas, Math.floor((width - canvas.width) / 2), height - canvas.height);
    return padded;
}
