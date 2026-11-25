import {Component,type ReactNode} from 'react';
export default class ViewerBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return{failed:true}}
 render(){return this.state.failed?<><p className="chem-fallback" role="status">3D rendering is unavailable on this device. The 2D investigation remains available.</p>{this.props.fallback}</>:this.props.children}
}
