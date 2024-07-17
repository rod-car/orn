import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export async function getPdf({
  fileName,
  title,
  className = "custom-chart",
}: {
  fileName: string;
  title?: string;
  className?: string;
}): Promise<void> {
  const doc = new jsPDF("p", "px");
  const elements = document.getElementsByClassName(className);

  await creatPdf({ doc, elements, title });
  doc.save(fileName);
}

async function creatPdf({
  doc,
  elements,
  title,
}: {
  doc: jsPDF;
  elements: HTMLCollectionOf<Element>;
  title?: string;
}): Promise<void> {
  const padding = 10;
  const marginTop = 20;
  let top = marginTop;

  const h2 = document.createElement("h2");
  h2.classList.add("mb-5", "text-uppercase", "text-center", "fw-bold");

  if (title) {
    h2.innerHTML = title;
    elements.item(0)?.prepend(h2);
  }

  for (let i = 0; i < elements.length; i++) {
    const el = elements.item(i) as HTMLElement;
    // el.querySelector('p')?.classList.remove('d-none')

    const imgData = await htmlToImage.toPng(el);
    // el.querySelector('p')?.classList.add('d-none')

    let elHeight = el.offsetHeight + 5;
    let elWidth = el.offsetWidth;

    const pageWidth = doc.internal.pageSize.getWidth();

    if (elWidth > pageWidth) {
      const ratio = pageWidth / elWidth;
      elHeight = elHeight * ratio - padding * 2;
      elWidth = elWidth * ratio - padding * 2;
    }

    const pageHeight = doc.internal.pageSize.getHeight();

    if (top + elHeight > pageHeight) {
      doc.addPage();
      top = marginTop;
    }

    doc.addImage(imgData, "PNG", padding, top, elWidth, elHeight, `image${i}`);
    top += elHeight + marginTop;
  }
  h2.remove();
}

export const generateColor = (notation: string, seed: number): string => {
  const hash = (notation + seed).split("").reduce((acc, char) => {
    const chr = char.charCodeAt(0);
    acc = (acc << 5) - acc + chr;
    return acc & acc;
  }, 0);

  const red = (hash & 0xff0000) >> 16;
  const green = (hash & 0x00ff00) >> 8;
  const blue = hash & 0x0000ff;

  return `rgba(${red}, ${green}, ${blue}, 0.6)`;
};
