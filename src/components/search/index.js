import { h, Component } from 'preact';
import wire from 'wiretie';


@wire('zimbra', ({ terms }) => ({
	searchResults: [
		'searchRequest',
		{
			limit: 1,
			needExp: 1,
			query: terms,
			types: 'message'
		}
	]
}))
export default class Search extends Component {

    render({searchResults, pending, rejected }) {
      console.log(searchResults);
			let loading = pending && 'Loading...';
			let error = rejected && 'Error';
			let empty = !searchResults || !searchResults.length && 'Empty';
			let results = !empty && searchResults.messages.map(message => <div>{message.excerpt}</div>);

        return (
				<span>
					{loading || error || empty || results }
				</span>
			);
    }
}
