import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";

export default function DatePicker() {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    return (
        <DateRangePicker
            ranges={[
                {
                    startDate: startDate,
                    endDate: endDate,
                    key: "selection",
                },
            ]}
            onChange={({ selection }) => {
                setStartDate(selection.startDate);
                setEndDate(selection.endDate);
            }}
        />
    );
}
