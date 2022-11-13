export function FrontEndJump(param: URLSearchParams) {
    const link = document.createElement("a");
    link.href = `goodguy://jump/?${param.toString()}`;
    link.click();
}