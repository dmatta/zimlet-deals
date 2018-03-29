import { h, Component } from 'preact';

export default class Search extends Component {
    render() {
        let time = new Date().toLocaleTimeString();
        return <span>{ time }</span>;
    }
}
