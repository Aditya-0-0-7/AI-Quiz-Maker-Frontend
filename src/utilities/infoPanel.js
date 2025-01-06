import './infoPanel.css';
import copyBtnImg from '../Images/copy-svgrepo-com.svg';
function InfoPanel({setShowPanel, data, note, triggerToast})
{
    const handleCopy = (text) => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            triggerToast("Code copied to clipboard");
          })
          .catch(() => {
            triggerToast("Some error occured. Can not copy the code.");
          });
    };

    return(
        <section id="infoPanelHolder">
            <div className="infoPanelBody">
                <div className='panelBar'><div className='crossPanel' style={{cursor:'pointer'}} onClick={()=>{setShowPanel(value=>!value)}}>X</div></div>
                <div className="panelContent">
                    <div className='panelData'>
                        {Object.keys(data).map(key=>{
                            return(
                            <div className='panelItem'>
                                <div className='panelItemData'>{key}: {data[`${key}`]}</div>
                                <div className="panelCopyBtn"><img src={copyBtnImg} className='panelCopyBtnImg' onClick={()=>{handleCopy(data[`${key}`])}} /></div>
                            </div>);
                        })}
                    </div>
                    <div className='note'>
                        {note}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default InfoPanel;