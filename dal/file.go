package dal

import "os"

func CheckAndMakeDir() {
	if _, err := os.Stat(".goodguy-desktop"); os.IsNotExist(err) {
		err := os.Mkdir(".goodguy-desktop", 0666)
		if err != nil {
			panic(err)
		}
	}
}
