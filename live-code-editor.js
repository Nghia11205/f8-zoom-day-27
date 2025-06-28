codeEditor = document.querySelector(".code-editor");
previewFrame = document.querySelector(".preview-frame");
previewPane = document.querySelector(".preview-pane");
contextMenu = document.querySelector(".context-menu");
console.log(codeEditor, previewFrame);
codeEditor.oninput = function (event) {
    previewFrame.setAttribute("srcdoc", this.value);
};
window.onbeforeunload = function (e) {
    return;
};

const wrapper = document.querySelector(".wrapper");
wrapper.oncontextmenu = function (event) {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    contextMenu.hidden = false;
    const widthMenu = contextMenu.clientWidth;
    const heightMenu = contextMenu.clientHeight;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    if (x > 600) {
        contextMenu.style.left = `calc(${x - widthMenu}px)`;
    }
    if (y > 520) {
        contextMenu.style.top = `calc(${y - heightMenu}px)`;
    }
    if (event.target === previewPane) {
        contextMenu.style.top = `calc(${y})px`;
        contextMenu.style.left = `${x}px`;
        if (y > 520) {
            contextMenu.style.top = `calc(${y - heightMenu}px)`;
        }
        if (x > 1350) {
            contextMenu.style.left = `calc(${x - widthMenu}px)`;
        }
    }
    contextMenu.onclick = function (event) {
        event.preventDefault();
        const target = event.target;

        if (target.closest(".edit")) {
            codeEditor.focus();
        }

        if (target.closest(".reset")) {
            codeEditor.value =
                "<h1>Hi sếp Dũng, chúc anh ngày mới tốt lành hẹ hẹ...!</h1>";
            previewFrame.setAttribute("srcdoc", codeEditor.value);
        }

        if (target.closest(".delete")) {
            codeEditor.value = "";
            previewFrame.setAttribute("srcdoc", "");
        }
        if (target.closest(".copy")) {
            navigator.clipboard.writeText(codeEditor.value).then();
        }
        contextMenu.hidden = true;
    };
};
wrapper.onmousedown = function () {
    contextMenu.hidden = true;
};
contextMenu.oncontextmenu = function (event) {
    event.preventDefault();
};
