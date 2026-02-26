import { actions } from "astro:actions";

interface Contact {
  init: () => void;
}
  
export function contact(): Contact {
  function init() {
    const contactForm = document.querySelector("form");
    const submitButton =
      document.querySelector<HTMLElement>("[type='submit']");
    const inputElement = document.querySelectorAll<HTMLElement>(
      "[data-control-input]",
    );
    const formAlert = document.querySelector<HTMLElement>("[role='alert']");
    const formDataFields: Record<string, HTMLElement | null> = {
      name: document.querySelector<HTMLElement>("#error-name"),
      email: document.querySelector<HTMLElement>("#error-email"),
      subject: document.querySelector<HTMLElement>("#error-subject"),
      message: document.querySelector<HTMLElement>("#error-message"),
    };

    inputElement.forEach((input) => {
      input.addEventListener("keydown", () => {
        const field = input.getAttribute("name");
        if (!field) return;

        const element = formDataFields[field];
        if (!element) return;

        element.innerText = "";
      });
    });

    contactForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);

      submitButton?.setAttribute("disabled", "true");
      const result: { [key: string]: string | any } = await actions
        .postContact(formData)
        .finally(() => {
          submitButton?.removeAttribute("disabled");
        });

      const nameFields = Object?.keys(result?.error?.fields ?? {});

      if (result?.data?.success) {
        contactForm?.reset();
        setAlert(result.data.message, "alert-success", formAlert);
      }
      if (Object.keys(result?.error).length)
        setAlert(result?.error.message, "alert-error", formAlert);

      nameFields.forEach((field: string) => {
        const element = formDataFields[field];
        if (!element) return;

        element.classList.remove("hidden");
        element.innerText = "";
        element.append(result?.error?.fields[field]);
      });
    });
  }

  function closeAlert(formAlert: HTMLElement) {
    if (!formAlert) return;
    formAlert.classList.remove(
      "opacity-100",
      "visible",
      "p-4",
      "mb-6",
      "h-auto",
    );
    formAlert.classList.add("opacity-0", "invisible", "p-0", "mb-0", "h-0");
  }

  function setAlert(
    text: string,
    typeAlert: string,
    formAlert: HTMLElement | null,
  ) {
    const spanAlert = formAlert?.querySelector("span");
    if (!formAlert) return;
    formAlert.classList.add(typeAlert);
    formAlert.classList.remove(
      "opacity-0",
      "invisible",
      "p-0",
      "mb-0",
      "h-0",
    );
    formAlert.classList.add(
      "opacity-100",
      "visible",
      "p-4",
      "mb-6",
      "h-auto",
    );
    if (spanAlert) spanAlert.innerText = text;

    setTimeout(() => {
      closeAlert(formAlert);
    }, 10000);
  }

  return { init };
};



