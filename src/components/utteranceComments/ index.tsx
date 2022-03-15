export const Comments: React.FC = () => (
  <section
    ref={elem => {
      if (!elem) {
        return;
      }
      console.log(elem.children.length);
      if (elem.children.length < 1) {
        const scriptElem = document.createElement('script');
        scriptElem.src = 'https://utteranc.es/client.js';
        scriptElem.crossOrigin = 'anonymous';
        scriptElem.setAttribute('repo', 'ErickBss/space-traveling');
        scriptElem.setAttribute('issue-term', 'url');
        scriptElem.setAttribute('theme', 'github-dark');
        elem.appendChild(scriptElem);
      } else {
        return;
      }
    }}
  />
);
