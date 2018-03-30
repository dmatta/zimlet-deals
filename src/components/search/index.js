import { h, Component } from 'preact';
import wire from 'wiretie';
import style from './style';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { DEALS_FOLDER } from '../../constants';

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
			query: `in:"${DEALS_FOLDER}"`,
			types: 'message'
		}
	]
}))
export default class Search extends Component {
	static defaultProps = {terms:"off OR sale OR clearance OR discount OR offers OR steal OR gift OR last chance OR coupon"};
	render({ dealsFolder, searchResults, savedResults, pending = {} , rejected = {}, refresh }) {
		console.log(searchResults, savedResults);
		let loading = (pending.searchResults || pending.savedResults) && 'Loading...';
		let error = (rejected.searchResults || rejected.savedResults) && 'Error';
		let emptySearchResults = (!searchResults || !searchResults.length) && 'Empty';
		let emptySavedResults = (!savedResults || !savedResults.length) && 'Empty';
		let results = !emptySearchResults && searchResults.messages
			.filter(message => /(off|sale|clearance|discount|offers|steal|gift|last chance|coupon)/i.test(message.subject))
			.map(message => <DealItem dealsFolder={dealsFolder} message={message} refresh={refresh} isSaved={false}></DealItem>);
		let saved = !emptySavedResults && savedResults.messages
			.map(message => <DealItem dealsFolder={dealsFolder} message={message} refresh={refresh} isSaved={true}></DealItem>);

		return (
			<div class={style.main}>
				<h2 class={style.header}>Coupons & Deals</h2>
				<ul class={style.deals}>
					{loading || error || emptySavedResults || saved }
				</ul>
				<hr/>
				<ul class={style.deals}>

					{loading || error || emptySearchResults || results }
				</ul>
			</div>
		);
	}
}

function getHTMLPart(mimePartsRoot) {
	console.log('mimeParts:', mimePartsRoot);
	if (mimePartsRoot.contentType === 'text/html') {
		return mimePartsRoot.content;
  	}

  	if (mimePartsRoot.contentType === 'multipart/alternative') {
    	const htmlPart = mimePartsRoot.mimeParts
      		.filter(({ contentType }) => contentType === 'text/html')[0];

    if (htmlPart) {
      return htmlPart.content;
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
		this.props.moveMailItem({ type:"message", id:this.props.message.id, destFolderId: this.props.dealsFolder.id });
		this.props.refresh && this.props.refresh();
	}

	removeSavedDeals = () => {
		console.log(`removing saved deal messageId ${this.props.message.id}`);
		this.props.moveMailItem({ type:"message", id:this.props.message.id, destFolderId:2});
		this.props.refresh && this.props.refresh();
	}

	findUnsubLink = () => {
		console.log('finding unsubscribe link for ', this.props.message);
		if (!this.props.message.mimeParts) {
			return;
		}
		//console.log(getHTMLPart(this.props.message.mimeParts));
		let doc = new DOMParser().parseFromString(getHTMLPart(this.props.message.mimeParts[0]), 'text/html');
		let anchors = doc.getElementsByTagName('a');

		let unsubRedirect = Array.from(anchors).find(({ textContent, href })=>
			/unsubscribe/.test(textContent) || /unsubscribe/.test(href)
		);

		console.log('unsubRedirect:', unsubRedirect);
		return unsubRedirect && unsubRedirect.href; //guard
	}

	render({message, isSaved, Sidebar, Button, Icon}) {
		let button = isSaved ? (
			<span class={style.dealRight}><Button class={style.removeButton} onClick={this.removeSavedDeals}><span><Icon name="close"/></span></Button></span>
		) : (
			<span class={style.dealRight}><Button styleType="primary" brand="primary>" onClick={this.moveToSavedDeals}>Save</Button> <Button styleType="secondary" href={this.findUnsubLink()}>Unsubscribe</Button></span>
		);

		let icon = isSaved ? (
			<span class={style.savedDealLeft}><Icon name="check" size="lg"/></span>
		) : (
			<span class={style.dealLeft}><Icon name="fa:cut" /></span>
		);

		console.log(this.context);
		return (
			<li class={style.deal}>
				{icon}
				<span class={style.dealMiddle}>
					<a href={`conversation/-${message.id}`}>
						{`${message.from[0].name}:  ${message.subject}`}</a>
						<br/>Expires: 2018-Apr-15
			</span>
			{button}
		</li>
	);
	}
}
