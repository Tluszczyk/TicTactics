package errors

import "errors"

var (
	ErrUnsupported         = errors.New("unsupported")
	ErrNoDocuments         = errors.New("no documents found")
	ErrItemAlreadyExists   = errors.New("item already exists")
)
