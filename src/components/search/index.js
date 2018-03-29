import { h, Component } from 'preact';
import wire from 'wiretie';
import style from './style';

@wire('zimbra', ({ terms }) => ({
	searchResults: [
		'searchRequest',
		{
			needExp: 1,
			query: terms,
			types: 'message'
		}
	]
}))
export default class Search extends Component {
	static defaultProps = {terms:"off OR sale OR clearance OR discount OR offers OR steal OR gift OR last chance"}
	render({searchResults, pending, rejected }) {
		console.log(searchResults);
		let loading = pending && 'Loading...';
		let error = rejected && 'Error';
		let empty = !searchResults || !searchResults.length && 'Empty';
		let results = !empty && searchResults.messages
//				.filter(message => /off|sale|clearance|discount|offers|steal|gift|last chance/i.test(message.subject))
				.map(message => <DealItem message={message.subject}></DealItem>);

		return (
			<span>
				<div class={style.main}>
					<ul class={style.deals}>

						{loading || error || empty || results }
					</ul>
				</div>
			</span>
		);
	}
}

@wire('zimbraComponents', null, ({ Sidebar, Button, Icon }) => ({ Sidebar,Button,Icon }))
class DealItem extends Component {
	render({message, Sidebar, Button, Icon}) {
		return (
			<li class={style.deal}>
				<span class={style.dealLeft}><Icon name="archive" /></span>
				<span class={style.dealMiddle}><a href="#">{message}</a><br/>Expires: 2018-Apr-15
			</span>
			<span class={style.dealRight}><Button styleType="primary" brand="primary>">Save</Button> <Button styleType="secondary">Unsubscribe</Button></span>
		</li>
	);
	}
}
