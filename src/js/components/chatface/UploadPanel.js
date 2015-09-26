/**
 * Created by JetslyLi on 2015/9/10.
 */

import React, {PropTypes} from 'react';


export default class UploadPanel extends React.Component {
    render() {

        return (
            <input type="file" name="fileToUpload"  accept="image/gif,image/jpeg,image/x-png,image/tiff,image/x-ms-bmp" onChange={this.props.changeItem.bind(this)} />
        )
    }


}

