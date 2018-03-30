import { h, Component } from 'preact';
import wire from 'wiretie';
import style from './style';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';

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
	],
	savedResults: [
		'searchRequest',
		{
			limit: 500,
			needExp: 1,
			query: "in:saved-deals",
			types: 'message'
		}
	]
}))
export default class Search extends Component {
	static defaultProps = {terms:"off OR sale OR clearance OR discount OR offers OR steal OR gift OR last chance OR coupon"}
	render({searchResults, savedResults, pending = {} , rejected = {}, refresh }) {
		console.log(searchResults, savedResults);
		let loading = (pending.searchResults || pending.savedResults) && 'Loading...';
		let error = (rejected.searchResults || rejected.savedResults) && 'Error';
		let empty = (!searchResults || !searchResults.length || !savedResults || !savedResults.length) && 'Empty';
		let results = !empty && searchResults.messages
			.filter(message => /(off|sale|clearance|discount|offers|steal|gift|last chance|coupon)/i.test(message.subject))
			.map(message => <DealItem message={message} refresh={refresh}></DealItem>);
		let saved = !empty && savedResults.messages
			.map(message => <DealItem message={message} savedStyle="display:none"></DealItem>);

		return (
			<div class={style.main}>
				<h2 class={style.header}>Saved Coupons</h2>
				<ul class={style.deals}>
					{loading || error || empty || saved }
				</ul>
				<h2 class={style.header}>New Coupons</h2>
				<ul class={style.deals}>

					{loading || error || empty || results }
				</ul>
			</div>
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


@wire('store', null, (store) => ({
	moveMailItem: store.zimletRedux.actions.mail.moveMailItem
}))
@connect(undefined, (dispatch, { moveMailItem }) => bindActionCreators({ moveMailItem }, dispatch))

@wire('zimbraComponents', null, ({ Sidebar, Button, Icon }) => ({ Sidebar,Button,Icon }))
class DealItem extends Component {

	moveToSavedDeals = () => {
		console.log(`Moving messageId ${this.props.message.id}`);
		this.props.moveMailItem({ type:"message", id:this.props.message.id, destFolderId:297});
		this.props.refresh && this.props.refresh();
	}


	findUnsubLink = () => {
		//console.log(getHTMLPart(this.props.message.mimeParts));						            
		let doc = new DOMParser().parseFromString(getHTMLPart(this.props.message.mimeParts), 'text/html'); 
		let tags = doc.getElementsByTagName('a'); 				 	                              		   

		let unsubRedirect = Array.from(tags).find((tag)=> tag.textContent.toLowerCase() === "unsubscribe" || tag.textContent.toLowerCase() === "unsubscribing" || tag.href.toLowerCase().indexOf("unsubscribe")>=0));
		console.log(unsubRedirect);
		return unsubRedirect && unsubRedirect.href; //guard 
	}

	render({message, savedStyle, Sidebar, Button, Icon}) {
		console.log(this.context);
		return (
			<li class={style.deal}>
				<span class={style.dealLeft}><Icon name="fa:cut" /></span>
				<span class={style.dealMiddle}>
					<a href={`conversation/-${message.id}`}>
						{`${message.from[0].name}:  ${message.subject}`}</a>
						<br/>Expires: 2018-Apr-15
			</span>

			<span class={style.dealRight}>
			<Button style={savedStyle} styleType="primary" brand="primary>" onClick={this.moveToSavedDeals}>Save</Button> 
			<Button styleType="secondary" href={this.findUnsubLink()}>Unsubscribe</Button></span>

		</li>
	);
	}
}
