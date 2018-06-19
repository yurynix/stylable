import style from "./index.st.css";

function load() {
    return import('./comp');
}
const m = load();
const s = document.createElement('style')
s.textContent = style.$css;
document.head.appendChild(s);
document.documentElement.classList.add(style.root);
document.body.classList.add(style.index);
window.backgroundColorAtLoadTime = getComputedStyle(document.documentElement).backgroundColor;