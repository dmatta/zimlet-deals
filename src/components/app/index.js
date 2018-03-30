import { h, Component } from 'preact';
import { provide } from 'preact-context-provider';
import { withIntl } from '../../enhancers';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { DEALS_FOLDER } from '../../constants';
import wire from 'wiretie';
import style from './style';

import Search from '../search';

export default function createApp(context) {

	@withIntl
	@provide({ zimbraComponents: context.components })
	@wire('zimbraComponents', null, ({ MailSidebar, Button, Icon }) => ({ MailSidebar,Button,Icon }))
	@wire('store', null, ({ zimletRedux }) => ({ createFolder: zimletRedux.actions.folders.createFolder }))
	@connect(null, (dispatch, { createFolder }) => bindActionCreators({ createFolder }, dispatch))
	class App extends Component {

		createSavedDealsFolderIfNecessary = () => {
			const { createFolder } = this.props;

			//Fetch the Notepad folder and create it if it doesn't exist
			createFolder({ parentFolderId: 1, name: DEALS_FOLDER, path: '/', fetchIfExists: true })
				.then((dealsFolder) => { this.setState({ dealsFolder }); })
				.catch(console.error.bind(console, 'FAILURE: '))
		}

		componentWillMount() {
			this.createSavedDealsFolderIfNecessary();
		}

		render({ MailSidebar,Button,Icon }, { dealsFolder }) {
			return (
				<div class={style.wrapper}>
					{/*Example of using component from ZimbraX client, in this case, MailSidebar*/}
					<MailSidebar />
					<Search dealsFolder={dealsFolder} />
				</div>
			);
		}
	}

	return App;

}
