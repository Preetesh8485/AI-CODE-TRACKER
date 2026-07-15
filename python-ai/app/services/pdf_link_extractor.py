import fitz

def extract_pdf_text(pdf_path: str) -> str:
    """
    Extract all visible text from a PDF.
    Used for Job Description PDF files.
    """

    doc = fitz.open(pdf_path)

    try:
        text = "\n".join(
            page.get_text()
            for page in doc
        )

        return text.strip()

    finally:
        doc.close()
def extract_links(pdf_path: str):
    links = {
        "linkedin": None,
        "github": None,
        "portfolio": None,
    }

    doc = fitz.open(pdf_path)

    try:
        for page_num, page in enumerate(doc):

            for link in page.get_links():

                uri = link.get("uri")

                if not uri:
                    continue

                uri_lower = uri.lower()

                # Rectangle occupied by the hyperlink
                rect = link.get("from")

                # Accept profile links only from the top of page 1
                in_header = (
                    page_num == 0
                    and rect is not None
                    and rect.y0 < 150
                )

                if in_header:

                    if (
                        "linkedin.com" in uri_lower
                        and links["linkedin"] is None
                    ):
                        links["linkedin"] = uri

                    elif (
                        "github.com" in uri_lower
                        and links["github"] is None
                    ):
                        links["github"] = uri

                    elif (
                        links["portfolio"] is None
                        and "linkedin.com" not in uri_lower
                        and "github.com" not in uri_lower
                    ):
                        links["portfolio"] = uri

        return links

    finally:
        doc.close()