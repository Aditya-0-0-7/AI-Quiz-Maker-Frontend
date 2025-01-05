import './toast.css';
function Toast({msg})
{
    return(
        <div className="toastBody">
            {msg}
        </div>
    )
}
export default Toast;