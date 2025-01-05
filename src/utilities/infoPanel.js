import './infoPanel.css';
function InfoPanel({setShowPanel, data, note})
{
    return(
        <section id="infoPanelHolder">
            <div className="infoPanelBody">
                <div className='panelBar'><div className='crossPanel' style={{cursor:'pointer'}} onClick={()=>{setShowPanel(value=>!value)}}>X</div></div>
                <div className="panelContent">
                    <div className='panelData'>
                        {Object.keys(data).map(key=><div className='panelItem'>{key}: {data[`${key}`]}</div>)}
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