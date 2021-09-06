import intl from 'intl2';
/**
 * App
 */
function App() {
    const title = 'title';
    const desc = `desc`;
    const desc2 = /*i18n-disable*/`desc`;
    const desc3 = `aaa ${ title + desc} bbb ${ desc2 } ccc`;

    return (
      <div className="app" title={"测试"}>
        <img src={Logo} />
        <h1>${title}</h1>
        <p>${desc}</p>  
        <div>
        {
            /*i18n-disable*/'中文'
        }
        </div>
      </div>
    );
  }