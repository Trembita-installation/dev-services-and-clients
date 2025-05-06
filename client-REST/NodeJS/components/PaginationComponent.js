import { Pagination } from 'react-bootstrap'

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
	const handlePageChange = pageNumber => {
		onPageChange(pageNumber)
	}

	return (
		<Pagination style={{ overflowX: 'auto', marginTop: 10, marginBottom: 10 }}>
			<Pagination.Prev
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
			/>
			{[...Array(totalPages)].map((_, index) => (
				<Pagination.Item
					key={index + 1}
					active={index + 1 === currentPage}
					onClick={() => handlePageChange(index + 1)}
				>
					{index + 1}
				</Pagination.Item>
			))}
			<Pagination.Next
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			/>
		</Pagination>
	)
}

export default PaginationComponent
