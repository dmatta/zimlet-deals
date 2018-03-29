import { h, Component } from 'preact';
import { provide } from 'preact-context-provider';
import { withIntl } from '../../enhancers';
import wire from 'wiretie';
import style from './style';

import Search from '../search';

export default function createApp(context) {

	@withIntl
	@provide({ zimbraComponents: context.components })
	@wire('zimbraComponents', null, ({ Sidebar, Button, Icon }) => ({ Sidebar,Button,Icon }))
	class App extends Component {

		render({ Sidebar,Button,Icon }) {
			return (
				<div class={style.wrapper}>
					{/*Example of using component from ZimbraX client, in this case, Sidebar*/}
					<Sidebar>
						<h3>Links</h3>
						<ol>
							<li>
								<a href="https://lonni.me">lonni.me</a>
							</li>
							<li>
								<a href="https://github.com/zimbra/zimlet-cli">zimlet-cli</a>
							</li>
						</ol>
					</Sidebar>
					<Search />
				</div>
			);
		}
	}

	return App;

}
