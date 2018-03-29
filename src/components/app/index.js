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
					<div class={style.main}>
						<ul class={style.deals}>
							<li class={style.deal}>
								<span class={style.dealLeft}><Icon name="archive" /></span>
								<span class={style.dealMiddle}><a href="#">Bluefly:Save $10 when you spend $40 on household essentials</a><br/>Expires: 2018-Apr-15
								</span>
								<span class={style.dealRight}><Button styleType="primary" brand="primary>">Save</Button> <Button styleType="secondary">Unsubscribe</Button></span>
							</li>
							<li class={style.deal}>
								<span class={style.dealLeft}><Icon name="archive" /></span>
								<span class={style.dealMiddle}><a href="#">Gobble gobble</a><br/>Expires: 2018-Apr-15
								</span>
								<span class={style.dealRight}><Button styleType="primary" brand="primary>">Save</Button> <Button styleType="secondary">Unsubscribe</Button></span>
							</li>
						</ul>
			<Search terms="you" />
					</div>
				</div>
			);
		}
	}

	return App;

}
