export class Helper {
    constructor() {}

    base64ToBlob(base64Data: string, contentType: any) {
        contentType = contentType || '';

        const sliceSize = 1024;
        const byteCharacters = window.atob(base64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const bytesArrays = new Array(slicesCount);

        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);
            const bytes = new Array(end - begin);

            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }

            bytesArrays[sliceIndex] = new Uint8Array(bytes);
        }

        return new Blob(bytesArrays, { type: contentType });
    }
}