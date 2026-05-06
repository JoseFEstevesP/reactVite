import { useState } from 'react';
import { Icons } from '../icon/Icons';
import styles from './styles.module.scss';

interface CalendarProps {
	selectedDate?: string;
	onSelect: (date: string) => void;
}

const monthNames = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];

const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const Calendar = ({ selectedDate, onSelect }: CalendarProps) => {
	const [currentDate, setCurrentDate] = useState(() => {
		if (selectedDate) {
			const date = new Date(selectedDate);
			return isNaN(date.getTime()) ? new Date() : date;
		}
		return new Date();
	});

	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const startDay = (firstDayOfMonth + 6) % 7;

	const handlePrevMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
	};

	const handleDayClick = (day: number) => {
		const date = new Date(currentYear, currentMonth, day);
		const formattedDate = date.toISOString().split('T')[0];
		onSelect(formattedDate);
	};

	const isSelected = (day: number) => {
		if (!selectedDate) return false;
		const selected = new Date(selectedDate);
		return (
			selected.getFullYear() === currentYear &&
			selected.getMonth() === currentMonth &&
			selected.getDate() === day
		);
	};

	const isToday = (day: number) => {
		const today = new Date();
		return (
			today.getFullYear() === currentYear &&
			today.getMonth() === currentMonth &&
			today.getDate() === day
		);
	};

	const cells = [];

	for (let i = 0; i < startDay; i++) {
		cells.push(<div key={`empty-${i}`} className={styles.calendar__dayCell} />);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const selected = isSelected(day);
		const today = isToday(day);

		cells.push(
			<div key={day} className={styles.calendar__dayCell}>
				<button
					className={`${styles.calendar__day} ${
						selected ? styles['calendar__day--selected'] : ''
					} ${today ? styles['calendar__day--today'] : ''}`}
					onClick={() => handleDayClick(day)}
					aria-label={`Select day ${day}`}
				>
					{day}
				</button>
			</div>,
		);
	}

	return (
		<div className={styles.calendar}>
			<div className={styles.calendar__header}>
				<button
					type="button"
					className={styles.calendar__navButton}
					onClick={handlePrevMonth}
					aria-label="Previous month"
				>
					<Icons iconName="arrow" style={{ transform: 'rotate(180deg)' }} />
				</button>
				<span className={styles.calendar__title}>
					{monthNames[currentMonth]} {currentYear}
				</span>
				<button
					type="button"
					className={styles.calendar__navButton}
					onClick={handleNextMonth}
					aria-label="Next month"
				>
					<Icons iconName="arrow" />
				</button>
			</div>
			<div className={styles.calendar__daysHeader}>
				{dayNames.map(day => (
					<div key={day} className={styles.calendar__dayHeader}>
						{day}
					</div>
				))}
			</div>
			<div className={styles.calendar__daysGrid}>{cells}</div>
		</div>
	);
};
