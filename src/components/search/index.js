import { h, Component } from 'preact';
import wire from 'wiretie';
import style from './style';

@wire('zimbra', ({ terms }) => ({
	searchResults: [
		'searchRequest',
		{
			limit: 500,
			needExp: 1,
			query: terms,
			types: 'message',
			fetch: 'all'
		}
	]
}))
export default class Search extends Component {
	static defaultProps = {terms:"off OR sale OR clearance OR discount OR offers OR steal OR gift OR last chance OR coupon"}
	render({searchResults, pending, rejected }) {
		console.log(searchResults);
		let loading = pending && 'Loading...';
		let error = rejected && 'Error';
		let empty = !searchResults || !searchResults.length && 'Empty';
		let results = !empty && searchResults.messages
			.filter(message => /(off|sale|clearance|discount|offers|steal|gift|last chance|coupon)/i.test(message.subject))
			.map(message => <DealItem message={message}></DealItem>);

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

function getHTMLPart(mimePartsRoot) {
	if (mimePartsRoot.contentType === 'text/html') {
		return mimePartsRoot.text;
  	}

  	if (mimePartsRoot.contentType === 'multipart/alternative') {
    	const htmlPart = mimePartsRoot.mimeParts
      		.filter(({ contentType }) => contentType === 'text/html')[0];

    if (htmlPart) {
      return htmlPart.text;
    }
  }
}

@wire('zimbraComponents', null, ({ Sidebar, Button, Icon }) => ({ Sidebar,Button,Icon }))
class DealItem extends Component {

	actionWasClicked = ( messageId ) => {
		console.log(`Moving messageId ${messageId}`);
	}

	findUnsubLink = () => {
		//console.log(getHTMLPart(this.props.message.mimeParts));						            
		let doc = new DOMParser().parseFromString(getHTMLPart(this.props.message.mimeParts), 'text/html'); 
		let tags = doc.getElementsByTagName('a'); 				 	                              		   

		let unsubRedirect = Array.from(tags).find((tag)=> tag.textContent.toLowerCase() === "unsubscribe" || tag.textContent.toLowerCase() === "unsubscribing" || tag.href.toLowerCase().indexOf("unsubscribe")>=0));
		console.log(unsubRedirect);
		return unsubRedirect && unsubRedirect.href; //guard 
	}

	render({message, Sidebar, Button, Icon}) {
		return (
			<li class={style.deal}>
				<span class={style.dealLeft}><Icon name="archive" /></span>
				<span class={style.dealMiddle}>
					<a href={`conversation/-${message.id}`}>
						{`${message.from[0].name}:${message.subject}`}</a>
						<br/>Expires: 2018-Apr-15
			</span>
			<span class={style.dealRight}>
			<Button styleType="primary" brand="primary>" onClick="this.moveToSavedDeals({message.id})">Save</Button> 
			<Button styleType="secondary" href={this.findUnsubLink()}>Unsubscribe</Button></span>
		</li>
	);
	}
}
