const initState = {
    extent:[6734829.193000, 2692598.219300, 8849899.518100, 4509031.393100],
    zoomLevel:5,
    enable3D:false,
}
const reducer = (state=initState, action)=>{
    switch(action.type){
        case 'TOGGLE_3D_CHANGE':
            let newEnable3D = !state.enable3D;
            return Object.assign({},state,{enable3D:  newEnable3D});
        default:
            return state;
    }
}
export default reducer;
