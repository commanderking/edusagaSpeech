var React = require('react')
var PropTypes = React.PropTypes;

function ActivityAggregateTable (props) {
	return (
		<div>
			<h1>Student Activity Data - Aggregate!</h1>
			<table className="table table-striped">
				<tbody>
					<tr>
						<th>Task</th>
						<th>% Correct</th>
						<th>% Used Hints</th>
						<th>% Skipped</th>
					</tr>
					{taskDataAggregateTable}
				</tbody>
			</table>	
		</div>
	)
}

module.exports = ActivityAggregateTable;